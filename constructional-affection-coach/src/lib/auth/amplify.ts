import { Amplify } from "aws-amplify";
import { PUBLIC_COGNITO_CLIENT_ID, PUBLIC_COGNITO_USER_POOL_ID } from "$env/static/public";

let isConfigured = false;

export const configureAmplify = () => {
	if (isConfigured) return;

	Amplify.configure({
		Auth: {
			Cognito: {
				userPoolId: PUBLIC_COGNITO_USER_POOL_ID,
				userPoolClientId: PUBLIC_COGNITO_CLIENT_ID,
				loginWith: {
					email: true
				}
			}
		}
	});

	isConfigured = true;
};
