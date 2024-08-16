import ENDPOINTS from './endPoint.js';
import { toCamelCase } from '../utils/transformCase.js';
/**
 * DB 서버에 API 요청을 보내는 함수
 * @param {ENDPOINTS} endpoint - ENDPOINTS 에 접근해서 원하는 기능을 선택 (기능까지만 고르세요 url,method X)
 * @param {JSON} data - 보낼 데이터, JSON 형식으로 변경해서 대입해주세요
 * @returns 결과를 toCamelCase로 변환후 반환
 */

const apiRequest = async (endpoint, data) => {
  try {
    console.log(endpoint.url);
    console.log(data);
    const response = await fetch(endpoint.url, {
      method: endpoint.method, // 또는 'GET' 메소드에 따라 변경
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`DB 서버 API 실패응답 ${response.status}`);
    }

    const result = await response.json();
    return toCamelCase(result);
  } catch (error) {
    console.error('DB 서버 API 요청중 오류 발생:', error);
    throw error;
  }
};

export default apiRequest;
