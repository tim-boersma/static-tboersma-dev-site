import { getProxyHttpClient } from '@/api/httpClient';
import type { VmState } from '~/app/types/VmState';


export const vmService = {
	/**
	 * Fetch current VM status
	 * @returns {VmState} The current VM state
	 */
	async getStatus(): Promise<VmState> {
		const proxyHttpClient = getProxyHttpClient();
		const response = await proxyHttpClient.get<string>('/vm/status');
		return response.data as VmState;
	},

	/**
	 * Toggle VM state
	 * @param {boolean} state - true to turn online, false to turn offline
	 * @returns {string} Summary message of the action performed
	 */
	async toggleVM(state: boolean): Promise<string> {
		const proxyHttpClient = getProxyHttpClient();
		const response = await proxyHttpClient.put<string>(`/vm/manual?state=${state}`);
		return response.data;
	},
};

export default vmService;
