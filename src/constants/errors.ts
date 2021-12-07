export const ENDPOINT_ERRORS = {
  USER_NOT_EXIST: 101, // 입력한 ID가 존재하지 않음
  PASSWORD_INVAILD: 102, // 입력한 비밀번호가 틀림
  INPUT_FIELD_NOT_FOUND: 103, // ID 혹은 비밀번호를 입력하지 않음
  ID_ALREADY_CLAIMED: 111, // 이미 사용중인 아이디
  ID_TOO_SHORT_OR_LONG: 112, // ID가 너무 김
  PASSWORD_TOO_SHORT: 113, // 비밀번호가 너무 짧음
  PASSWORD_CHECK_FAILD: 115, // 비밀번호와 비밀번호 확인이 일치하지 않음
  WALLET_NOT_FOUND: 211, // 월렛을 찾을 수 없음
  WALLET_NOT_OWNER: 212, // 월렛의 소유자가 아님
  WALLET_GENERATION_FAILD: 221, // 월렛 생성 실패
  ADDRESS_GENERATION_FAILD: 222, // 주소 생성 실패
  ALIAS_INVALID: 223, // 월렛 별명이 너무 짧거나 김
  ADDRESS_INVAILD: 231, // 주소 형식이 잘못됨
  AMOUNT_INVAILD: 232, // 송금액 형식이 잘못됨
  LOW_BALANCE: 235,
  TOO_SMALL_AMOUNT: 236, // 잔액 부족
  EXPLAIN_TOO_LONG: 312, // 설명이 너무 김
  ADDRESS_NOT_FOUND: 321, // 주소록을 찾을 수 없음
  ADDRESS_NOT_OWNER: 322, // 주소록의 등록자가 아님
  ADDRESS_ALEADY_EXIST: 323, // 주소록이 이미 존재함
  TOKEN_INVAILD: 901, // 로그인 하지 않았거나 세션이 유효하지 않음
  ENDPOINT_NOT_FOUND: 902, // 해당하는 엔드포인트를 찾을 수 없음
  PARAMS_INVAILD: 903 // 잘못된 파라미터
}

export type ENDPOINT_ERRORS_TYPE = keyof typeof ENDPOINT_ERRORS
