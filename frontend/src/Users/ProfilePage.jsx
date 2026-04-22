const ProfilePage = () => {
  return (
    <div className="container">
      {/* Banner Bleu en haut */}
      <header className="profile-header">
        <h1>Sara Alhane</h1>
        <p>12 jours consécutifs • Niveau Intermédiaire</p>
      </header>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '20px' }}>
        {/* Colonne de Gauche : Formulaire et Compétences */}
        <section>
          <div className="card">
            <h3>Modifier le profil</h3>
            {/* Formulaire ici */}
          </div>        
          <div className="card">
            <h3>Compétences</h3>
            {/* Liste des compétences avec barres de progression */}
          </div>
        </section>
        {/* Colonne de Droite : Statistiques et Badges */}
        <aside>
          <div className="card">
            <h3>Statistiques</h3>
            {/* Liste des stats (Leçons, Quiz...) */}
          </div>        
          <div className="card">
            <h3>Badges</h3>
            {/* Grille des badges */}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ProfilePage;