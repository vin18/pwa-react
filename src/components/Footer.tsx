import vtsLogo from '../../public/vts-logo.svg';

function Footer({ isSideMenuFooter = false }) {
  return (
    <footer className={`flex justify-center items-center mb-3`}>
      Powered by&nbsp;
      {isSideMenuFooter ? (
        <img className="h-16 w-16" src={vtsLogo} alt="VTS logo" />
      ) : (
        <span className="font-bold text-primary">
          Velocity TradeTech Solutions
        </span>
      )}
    </footer>
  );
}

export default Footer;
