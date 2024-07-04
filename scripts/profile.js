document.addEventListener('DOMContentLoaded', async () => {
    try {
      const userId = await window.electron.getCurrentUserId();
      const userProfile = await window.electron.getUserProfile(userId);
  
      document.getElementById('username').value = userProfile.username;
      document.getElementById('nom').value = userProfile.nom;
      document.getElementById('prenom').value = userProfile.prenom;
      document.getElementById('naissance').value = userProfile.date_naissance;
      let dateInscription = new Date(userProfile.date_inscription);
      document.getElementById('date_inscription').value = dateInscription.toISOString().split('T')[0];
    } catch (error) {
      console.error('Erreur lors de la récupération du profil utilisateur:', error);
    }
  });

document.getElementById('profile-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const userId = localStorage.getItem('currentUserId');
  console.log(userId)
  const username = document.getElementById('username').value;
  const nom = document.getElementById('nom').value;
  const prenom = document.getElementById('prenom').value;
  const date_naissance = document.getElementById('naissance').value;

  try {
    await window.electron.updateUserProfile({ userId, username, nom, prenom, date_naissance });
    alert('Profil mis à jour avec succès.');
  } catch (error) {
    console.error('Erreur lors de la mise à jour du profil:', error);
    alert('Erreur lors de la mise à jour du profil.');
  }
});
