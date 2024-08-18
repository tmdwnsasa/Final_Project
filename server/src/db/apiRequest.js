import ENDPOINTS from './endPoint.js';
import { toCamelCase } from '../utils/transformCase.js';
import CustomError from '../utils/error/customError.js';
/**
 * DB 서버에 API 요청을 보내는 함수
 * 스네이크 케이스로 데이터를 전달해 주세요
 * @param {ENDPOINTS} endpoint - ENDPOINTS 에 접근해서 원하는 기능을 선택 (기능까지만 고르세요 url,method X)
 * @param {JSON} data - 보낼 데이터, JSON 형식으로 변경해서 대입해주세요
 * @returns 결과를 toCamelCase로 변환후 반환
 */
const apiRequest = async (endpoint, data) => {
  try {
    const response = await fetch(endpoint.url, {
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new CustomError(10021, errorResponse.error);
    }

    const result = await response.json();
    return toCamelCase(result);
  } catch (error) {
    console.error('DB 서버 API 요청중 오류 발생:', error);
    throw error;
  }
};

export default apiRequest;
