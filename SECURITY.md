# Securite et operations

Ce projet ne doit jamais supprimer les donnees des apprenants deja inscrits sans action explicite, documentee et sauvegardee.

## Regles de protection

- Ne pas lancer de commande destructive Firebase depuis le poste local : `firebase firestore:delete`, scripts de purge, suppression Auth ou suppression Storage en masse.
- Ne pas commiter `.env.local`, cles de service, exports Firestore, tokens ou fichiers generes.
- Preferer les actions reversibles dans l'administration : suspension, archivage, changement de statut.
- Toute modification de `firestore.rules` ou `storage.rules` doit passer par lint/build et revue avant deploiement.
- Avant toute migration de donnees, faire un export/sauvegarde et tester sur un environnement de preproduction.
- Les acces administrateur doivent passer par le champ `role: "admin"` du document utilisateur, pas par un e-mail code en dur.

## Utilisateurs existants

Les profils dans `users`, les progressions, les memorisations, les certificats et les donnees d'apprentissage doivent etre conserves. La suspension d'un utilisateur marque le document avec `disabled: true`, mais ne supprime pas le document ni les sous-collections.

Un compte suspendu conserve ses donnees mais ne doit plus pouvoir ecrire dans les collections d'apprentissage ni televerser de fichier personnel.

## Secrets a verifier hors Git

- Regenerer toute cle de service qui aurait ete partagee ou committee par le passe.
- Garder les variables Firebase et VAPID uniquement dans Vercel/Firebase/local `.env.local`.
- Configurer `NEXT_PUBLIC_ADMIN_EMAIL` dans l'environnement si l'acces admin par e-mail est utilise.

## Verification avant mise en ligne

```bash
npm run lint
npm run build
npm run verify
```
