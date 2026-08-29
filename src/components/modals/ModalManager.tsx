import React from 'react';
import { useTambola } from '../../context/TambolaContext';
import { LiveGameModal } from './LiveGameModal';
import { BuyTicketModal } from './BuyTicketModal';
import { MyTicketsModal } from './MyTicketsModal';
import { ReferralModal } from './ReferralModal';
import { PrizesModal } from './PrizesModal';
import { WinnersModal } from './WinnersModal';
import { SupportModal } from './SupportModal';
import { LegalModal } from './LegalModal';
import { ResponsibleGamingModal } from './ResponsibleGamingModal';
import { AdminPanelModal } from './AdminPanelModal';
import { AuthModal } from './AuthModal';
import { UserSwitcherModal } from './UserSwitcherModal';
import { UserDashboardModal } from './UserDashboardModal';

export const ModalManager: React.FC = () => {
  const { activeModal } = useTambola();

  if (!activeModal) return null;

  switch (activeModal) {
    case 'userDashboard':
    case 'deposit':
    case 'withdraw':
      return <UserDashboardModal />;
    case 'playLive':
      return <LiveGameModal />;
    case 'buyTicket':
      return <BuyTicketModal />;
    case 'myTickets':
      return <MyTicketsModal />;
    case 'referral':
      return <ReferralModal />;
    case 'prizes':
      return <PrizesModal />;
    case 'winners':
      return <WinnersModal />;
    case 'support':
      return <SupportModal />;
    case 'legal':
      return <LegalModal />;
    case 'responsibleGaming':
      return <ResponsibleGamingModal />;
    case 'admin':
      return <AdminPanelModal />;
    case 'login':
    case 'register':
      return <AuthModal />;
    case 'userSwitcher':
      return <UserSwitcherModal />;
    default:
      return null;
  }
};
