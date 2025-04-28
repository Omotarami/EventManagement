// import React from 'react';
// import { render } from '@testing-library/react';
// import { BrowserRouter } from 'react-router-dom';
// import { AuthProvider } from '../contexts/AuthContext';
// import { EventProvider } from '../contexts/EventContext';
// import { TicketProvider } from '../contexts/TicketContext';

// const AllProviders = ({ children }) => {
//   return (
//     <BrowserRouter>
//       <AuthProvider>
//         <EventProvider>
//           <TicketProvider>
//             {children}
//           </TicketProvider>
//         </EventProvider>
//       </AuthProvider>
//     </BrowserRouter>
//   );
// };

// const customRender = (ui, options) =>
//   render(ui, { wrapper: AllProviders, ...options });

// export * from '@testing-library/react';
// export { customRender as render };