import { AuthGuard } from 'src/guards/auth-guard';

/* eslint-disable react/display-name */
export const withAuthGuard = (Component) => (props) => (
  <AuthGuard>
    <Component {...props} />
  </AuthGuard>
);
