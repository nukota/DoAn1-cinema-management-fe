// ===========================
// Optimized Cinema API DTOs
// ===========================

/**
 * Basic cinema information DTO
 */
export interface CinemaResponseDTO {
  _id: string;
  name: string;
  address: string;
}

/**
 * Enhanced cinema DTO with counts (for list view optimization)
 * This eliminates the need for multiple API calls
 */
export interface CinemaWithCountsDTO extends CinemaResponseDTO {
  employeeCount: number;
  roomCount: number;
}

/**
 * Optimized response for cinema list with counts
 * Used in: GET /cinema/with-counts (replaces GET /cinema + multiple detail calls)
 */
export interface FetchCinemasWithCountsResponseDTO {
  cinemas: CinemaWithCountsDTO[];
  total: number;
}

/**
 * DTO for creating a new cinema
 * Used in: POST /cinema
 */
export interface CreateCinemaRequestDTO {
  name: string;
  address: string;
}

/**
 * Detailed cinema information for specific operations
 * Used in: GET /cinema/employeeandroom/:cinemaId (when full details needed)
 */
export interface CinemaDetailsResponseDTO {
  _id: string;
  name: string;
  address: string;
  employees: CinemaEmployeeDTO[];
  rooms: CinemaRoomDTO[];
  statistics: {
    totalEmployees: number;
    totalRooms: number;
    activeRooms: number;
    inactiveRooms: number;
  };
}

/**
 * Employee information within cinema details
 */
export interface CinemaEmployeeDTO {
  _id: string;
  employee_id: string;
  full_name: string;
  email: string;
  position: string;
  shift: string;
}

/**
 * Room information within cinema details
 */
export interface CinemaRoomDTO {
  _id: string;
  room_number: string;
  capacity: number;
  room_type: string;
  status: "active" | "inactive" | "maintenance";
}

/**
 * Error response DTO
 */
export interface CinemaErrorResponseDTO {
  error: {
    message: string;
  };
}
