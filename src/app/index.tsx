import { verifyInstallation } from 'nativewind';
import Home from './home';

export default function Index() {

  verifyInstallation();

  return (
    <Home />
  );
}
