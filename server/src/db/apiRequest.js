import ENDPOINTS from './endPoint.js';
import { toCamelCase } from '../utils/transformCase.js';
import CustomError from '../utils/error/customError.js';
/**
 * DB 서버에 API 요청을 보내는 함수
 * @param {Object} endpoint - API 요청을 위한 엔드포인트 정보
 * @param {string} endpoint.url - 요청할 URL
 * @param {string} endpoint.method - HTTP 메서드 (GET, POST 등)
 * @param {Object} data - 요청에 사용할 데이터, JSON 형식
 * @returns {Promise<Object>} - 결과를 toCamelCase로 변환 후 반환
 * @throws {Error} - 요청이 실패할 경우 발생하는 오류
 */
const apiRequest = async (endpoint, data) => {
  try {
    if (endpoint == null || data == null) {
      throw new Error('API 요청에 대한 필드가 비어있습니다');
    }
    // GET 요청은 쿼리 문자열로 데이터를 전달
    let url = endpoint.url;
    if (endpoint.method === 'GET' && data) {
      const queryParams = new URLSearchParams(data).toString();
      url += `?${queryParams}`;
    }

    const response = await fetch(url, {
      method: endpoint.method,
      headers: {
        'Content-Type': 'application/json',
      },
      // GET 요청에는 body가 안보내짐....
      ...(endpoint.method !== 'GET' && { body: JSON.stringify(data) }), //조건부 스프레드
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      console.log(errorResponse);
      throw new CustomError(errorResponse.errorCode, errorResponse.errorMessage);
    }

    const result = await response.json();
    return toCamelCase(result);
  } catch (error) {
    console.error('DB 서버 API 요청중 오류 발생:', error);
    throw error;
  }
};

export default apiRequest;
