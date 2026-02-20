# Prompt pour Application de Calcul de Rebobinage Moteur

Créez une application web professionnelle pour le calcul de rebobinage de moteurs électriques, rotors bobinés, électrofreins et électro-aimants.

## Fonctionnalités Principales

### 1. Calculateur de Section de Fil
- Entrées :
  - Puissance du moteur (kW)
  - Tension nominale (V)
  - Nombre de phases (1 ou 3)
  - Nombre de pôles (2, 4, 6, 8, etc.)
  - Rendement estimé (%)
  - Densité de courant souhaitée (A/mm²) - par défaut 3-5 A/mm² selon le type de refroidissement
  - Type de service (continu S1, intermittent S2-S10)

- Calculs :
  - Courant nominal : I = P / (U × cos φ × √3 × η) pour triphasé
  - Section théorique : S = I / J (où J est la densité de courant)
  - Proposition de fils normalisés (avec diamètres standards : 0.5, 0.63, 0.71, 0.8, 0.9, 1.0, 1.12, 1.25, 1.4, 1.6, 1.8, 2.0, 2.24, 2.5 mm, etc.)

### 2. Calculateur de Nombre de Spires
- Entrées :
  - Tension par phase (V)
  - Fréquence (Hz)
  - Nombre de paires de pôles
  - Section du noyau magnétique (cm²)
  - Induction magnétique visée (Tesla) - généralement 0.8-1.4 T
  - Type de bobinage (concentré, distribué, ondulé, imbriqué)
  - Nombre d'encoches par pôle et par phase

- Calculs :
  - Formule de Boucherot : N = U / (4.44 × f × Φ × kw)
  - Où Φ = B × S (flux magnétique)
  - kw = coefficient de bobinage (typiquement 0.85-0.96)
  - Spires par encoche
  - Pas de bobinage

### 3. Base de Données des Calculs
- Sauvegarde automatique de chaque calcul avec Supabase
- Historique des projets :
  - Nom du moteur/projet
  - Date du calcul
  - Tous les paramètres d'entrée
  - Résultats obtenus
  - Notes et observations
- Export PDF des résultats

### 4. Bibliothèque de Données Techniques
- Table des fils de cuivre émaillés (diamètres normalisés, sections, résistance par mètre)
- Table des facteurs de bobinage selon le type
- Valeurs typiques d'induction selon le type de machine
- Densités de courant recommandées

## Interface Utilisateur

### Design Professionnel
- En-tête avec logo (icône de bobine/moteur électrique)
- Navigation par onglets :
  1. "Calcul Section Fil"
  2. "Calcul Spires"
  3. "Projets Sauvegardés"
  4. "Tables Techniques"

### Formulaires de Calcul
- Champs de saisie clairs et organisés avec unités
- Validation en temps réel
- Tooltips explicatifs sur les termes techniques
- Valeurs par défaut intelligentes
- Boutons "Calculer" et "Réinitialiser"

### Affichage des Résultats
- Carte de résultats bien structurée avec :
  - Résultats principaux en gros caractères
  - Détails des calculs intermédiaires
  - Recommandations de fils normalisés
  - Graphique de visualisation si pertinent

### ⚠️ AVERTISSEMENT DE SÉCURITÉ OBLIGATOIRE
Afficher SYSTÉMATIQUEMENT et de façon TRÈS VISIBLE un bandeau d'avertissement :

```
⚠️ AVERTISSEMENT PROFESSIONNEL

Ces calculs sont fournis à titre INDICATIF uniquement.
Un rebobinage de moteur électrique DOIT impérativement être :

✓ Validé par des mesures sur place (relevé des spires existantes, diamètre de fil)
✓ Testé à vide avant mise en charge
✓ Contrôlé en température (échauffement)
✓ Vérifié pour l'isolation électrique (mégohmmètre)
✓ Conforme aux normes en vigueur (NF, CEI)
✓ Réalisé par un professionnel qualifié

La mise en service d'un moteur mal rebobiné présente des risques :
incendie, électrocution, dommages matériels. L'utilisateur est seul responsable.
```

## Aspects Techniques

### Stack Technologique
- React avec TypeScript
- Tailwind CSS pour le design
- Lucide React pour les icônes
- Supabase pour la base de données
- Génération de PDF pour les rapports

### Base de Données Supabase
Tables nécessaires :
- `projects` : historique des calculs
- `wire_specifications` : données techniques des fils
- `winding_factors` : coefficients de bobinage

### Calculs et Formules
Implémenter avec précision :
- Loi d'Ohm et calculs de puissance
- Formule de Boucherot pour les spires
- Calculs de section avec densité de courant
- Conversions d'unités
- Arrondis appropriés (2-3 décimales)

## Apparence
- Design moderne, professionnel et technique
- Palette de couleurs : bleu électrique, gris acier, blanc
- ÉVITER le violet/indigo
- Typographie claire et lisible
- Responsive pour tablettes (usage atelier)
- Icônes techniques appropriées (bobines, fils, moteurs)

## Export et Impression
- Génération de rapport PDF avec :
  - En-tête professionnel
  - Tous les paramètres et résultats
  - Date et nom du projet
  - Avertissements de sécurité
  - Zone pour signature/validation

Créez une application complète, fonctionnelle et prête pour un usage professionnel en atelier de rebobinage.
