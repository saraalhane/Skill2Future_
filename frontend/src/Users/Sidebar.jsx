const Sidebar = () => {
  return (
    <nav style={{ width: '250px', backgroundColor: '#1e293b', color: 'white' }}>
      <div className="logo"> Skill2Future </div>
      
      <section>
        <h4>PRINCIPAL</h4>
        <ul>
          <li>Tableau de bord</li>
          <li>Apprentissage</li>
          <li>Quiz</li>
        </ul>
      </section>

      {/* ... Reste des liens (Ressources, Compte) ... */}

      <div className="user-footer">
        <p>Sara Alhane</p>
        <span>Apprenante</span>
      </div>
    </nav>
  );
};

export default Sidebar;