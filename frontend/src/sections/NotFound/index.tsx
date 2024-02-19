import './styles.css';

export const NotFound = () => {
  return (
    <div className="section">
      <h1 className="error">404</h1>
      <div className="page">Ooops!!! The page you are looking for is not found</div>
      <a className="back-home" href="/">
        Back to home
      </a>
    </div>
  );
};
