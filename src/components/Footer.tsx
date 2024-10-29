import { RegisterStatus } from '@/utils/callStatus';
import vtsLogo from '../../public/vts-logo.svg';
import { useSIPProvider } from './SipProvider';

function Footer() {
  // const { registerStatus } = useSIPProvider();

  return (
    <footer className={`flex justify-center items-center mb-3 mr-16`}>
      Powered by&nbsp;
      <span className="font-bold text-primary">
        Velocity TradeTech Solutions
      </span>
      {/* 
      <p
        className={`mb-2 ${
          registerStatus === RegisterStatus.UNREGISTERED
            ? 'text-red-500'
            : 'text-green-500'
        }`}
      >
        {registerStatus === RegisterStatus.UNREGISTERED
          ? 'Dealer is unregistered'
          : 'Dealer is registered'}{' '}
      </p> */}
    </footer>
  );
}

export default Footer;
