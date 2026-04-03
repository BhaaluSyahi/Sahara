import '../styles/PageLoader.css';

function PageLoader({ visible }) {
  if (!visible) return null;
  return (
    <div className="page-loader">
      <div className="page-loader__bar" />
    </div>
  );
}

export default PageLoader;
