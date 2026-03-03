/** Register — docs/api.md: register(email, password, name?) → AuthPayload */
export const REGISTER_MUTATION = `
  mutation Register($email: String!, $password: String!, $name: String) {
    register(email: $email, password: $password, name: $name) {
      token
      user { id email name createdAt }
    }
  }
`;

/** Login — docs/api.md: login(email, password) → AuthPayload */
export const LOGIN_MUTATION = `
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user { id email name }
    }
  }
`;
