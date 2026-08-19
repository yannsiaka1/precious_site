"""
Compose les visuels produit de la section « Jus naturels ».

Principe : la bouteille fournie n'est jamais retouchée. Elle est détourée sur
son canal alpha, redimensionnée, puis posée au centre d'un décor recréé —
dégradé, halo, ombre portée, logo. Le décor de référence est `pj_jus.png`
(dégradé orange radial, logo en haut à gauche), dont les mesures sont reprises
ici : format 2:3, logo à 17 % de la largeur, sujet occupant environ 70 % de la
hauteur.

Sortie : 1024 x 1536 (2:3), le format exact de l'emplacement sur le site.
"""

from PIL import Image, ImageDraw, ImageFilter
import numpy as np
import os

UPLOADS = "/mnt/user-data/uploads"
SORTIE = "public/assets/galerie"
LOGO = "public/assets/logo.webp"

LARGEUR, HAUTEUR = 1024, 1536


def degrade_radial(centre_rgb, bord_rgb, cx=0.5, cy=0.52, rayon=0.78):
    """Dégradé radial doux, dans l'esprit du décor de référence."""
    y, x = np.mgrid[0:HAUTEUR, 0:LARGEUR]
    # distance normalisée au centre, corrigée du rapport largeur/hauteur
    dx = (x / LARGEUR - cx) / rayon
    dy = (y / HAUTEUR - cy) / rayon * (HAUTEUR / LARGEUR) * 0.72
    d = np.clip(np.sqrt(dx**2 + dy**2), 0, 1)
    # courbe adoucie : le centre reste large, la bascule se fait vers l'extérieur
    t = (d**1.35)[..., None]
    fond = np.array(centre_rgb) * (1 - t) + np.array(bord_rgb) * t
    return Image.fromarray(fond.astype(np.uint8), "RGB")


def detoure(chemin):
    """Recadre une image sur son sujet opaque, sans rien modifier d'autre."""
    im = Image.open(chemin).convert("RGBA")
    alpha = np.array(im)[:, :, 3]
    ys, xs = np.where(alpha > 12)
    return im.crop((xs.min(), ys.min(), xs.max() + 1, ys.max() + 1))


def ombre(taille, flou, opacite):
    """
    Ombre elliptique posée sous la bouteille.

    L'ellipse est dessinée dans un calque plus grand qu'elle : sans cette
    marge, le flou serait coupé au bord et l'ombre apparaîtrait comme un
    rectangle.
    """
    marge = flou * 3
    couche = Image.new("L", (taille[0] + marge * 2, taille[1] + marge * 2), 0)
    ImageDraw.Draw(couche).ellipse(
        [marge, marge, marge + taille[0], marge + taille[1]], fill=opacite
    )
    return couche.filter(ImageFilter.GaussianBlur(flou))


def halo(centre_xy, rayon, force):
    """Éclaircissement circulaire derrière le sujet, pour le détacher du fond."""
    couche = Image.new("L", (LARGEUR, HAUTEUR), 0)
    ImageDraw.Draw(couche).ellipse(
        [centre_xy[0] - rayon, centre_xy[1] - rayon,
         centre_xy[0] + rayon, centre_xy[1] + rayon],
        fill=force,
    )
    return couche.filter(ImageFilter.GaussianBlur(rayon * 0.45))


def composer(bouteille_png, sortie, centre, bord, hauteur_sujet=0.70, halo_rgb=(255, 245, 220)):
    fond = degrade_radial(centre, bord)

    # Halo derrière la bouteille
    voile = Image.new("RGB", (LARGEUR, HAUTEUR), halo_rgb)
    fond = Image.composite(voile, fond, halo((int(LARGEUR * 0.52), int(HAUTEUR * 0.50)), 430, 62))

    bouteille = detoure(f"{UPLOADS}/{bouteille_png}")
    cible_h = int(HAUTEUR * hauteur_sujet)
    cible_l = round(bouteille.width * cible_h / bouteille.height)
    bouteille = bouteille.resize((cible_l, cible_h), Image.LANCZOS)

    x = (LARGEUR - cible_l) // 2
    y = int(HAUTEUR * 0.505) - cible_h // 2

    # Ombre au sol, légèrement décalée vers la droite comme sur la référence
    largeur_ombre = int(cible_l * 1.9)
    hauteur_ombre = int(cible_h * 0.075)
    flou = 52
    masque = ombre((largeur_ombre, hauteur_ombre), flou, 58)
    couche_ombre = Image.new("L", (LARGEUR, HAUTEUR), 0)
    couche_ombre.paste(
        masque,
        (
            x + cible_l // 2 - masque.width // 2 + 8,
            y + cible_h - hauteur_ombre // 3 - flou * 3,
        ),
    )
    noir = Image.new("RGB", (LARGEUR, HAUTEUR), (60, 30, 0))
    fond = Image.composite(noir, fond, couche_ombre)

    fond.paste(bouteille, (x, y), bouteille)

    # Logo en haut à gauche, aux proportions relevées sur la référence
    logo = Image.open(LOGO).convert("RGBA")
    largeur_logo = int(LARGEUR * 0.17)
    logo = logo.resize((largeur_logo, round(logo.height * largeur_logo / logo.width)), Image.LANCZOS)
    fond.paste(logo, (int(LARGEUR * 0.07), int(HAUTEUR * 0.05)), logo)

    fond.save(f"{SORTIE}/{sortie}", "WEBP", quality=86, method=6)
    return round(os.path.getsize(f"{SORTIE}/{sortie}") / 1024)


def etendre_reference(sortie):
    """
    « Augmenter le fond orange » du visuel de référence.

    On agrandit le décor autour de la composition existante en prolongeant le
    dégradé, puis on replace la scène d'origine au centre. La photo elle-même
    n'est ni recadrée ni retouchée : elle respire simplement davantage.
    """
    source = Image.open(f"{UPLOADS}/pj_jus.png").convert("RGB")
    fond = degrade_radial((236, 163, 55), (226, 130, 2))

    facteur = 0.94  # la scène occupe 94 % du nouveau cadre
    l = int(LARGEUR * facteur)
    h = round(source.height * l / source.width)
    scene = source.resize((l, h), Image.LANCZOS)

    # Fondu des bords pour que la scène se fonde dans le dégradé élargi
    masque = Image.new("L", (l, h), 255)
    marge = int(l * 0.10)
    degrade_bord = Image.new("L", (l, h), 0)
    ImageDraw.Draw(degrade_bord).rectangle(
        [marge, marge, l - marge, h - marge], fill=255
    )
    masque = degrade_bord.filter(ImageFilter.GaussianBlur(marge * 0.95))

    fond.paste(scene, ((LARGEUR - l) // 2, (HAUTEUR - h) // 2), masque)
    fond.save(f"{SORTIE}/{sortie}", "WEBP", quality=86, method=6)
    return round(os.path.getsize(f"{SORTIE}/{sortie}") / 1024)


if __name__ == "__main__":
    print("gingembre (référence élargie) :", etendre_reference("jus-gingembre.webp"), "Ko")
    print("hibiscus  :", composer("HIBISCUIT.png", "jus-hibiscus.webp",
                                  (198, 74, 58), (138, 26, 24),
                                  hauteur_sujet=0.72, halo_rgb=(255, 210, 180)), "Ko")
    print("jus vert  :", composer("JUS_VERT.png", "jus-vert.webp",
                                  (150, 190, 96), (86, 128, 44),
                                  hauteur_sujet=0.72, halo_rgb=(240, 255, 215)), "Ko")
    print("gingembre (petit format) :", composer("jus_0.png", "jus-gingembre-classique.webp",
                                  (243, 206, 92), (223, 152, 18),
                                  hauteur_sujet=0.62), "Ko")
