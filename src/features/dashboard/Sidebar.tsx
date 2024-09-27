import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <aside>
      <nav>
        <ul>
          <li><Link to="/dashboard">Home</Link></li>
          <li><Link to="/dashboard/users">Users</Link></li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;