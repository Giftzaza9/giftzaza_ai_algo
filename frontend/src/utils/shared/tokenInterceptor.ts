export default async function tokenInterceptor(requestConfig: any) {
	const store: any = localStorage.getItem('__hpad__');
	const token = JSON.parse(store);
	const pathname = window?.location?.pathname;

	if (
		requestConfig?.data?.isNoAuth ||
		(pathname &&
			!pathname.includes('create-password') &&
			(pathname.split('/')[1] !== 'hpad' || pathname.split('/').length < 2))
	) {
		// If the request is marked as no authentication required or if the path should not be authenticated, allow the request.
		return requestConfig;
	} else {
			// If the token is not expired, add it to the request headers and allow the request.
			return {
				...requestConfig,
				headers: {
					'Content-Type': 'application/json',
					...requestConfig.headers,
					Authorization: `Bearer ${token}`,
				},
			}
	}
}
