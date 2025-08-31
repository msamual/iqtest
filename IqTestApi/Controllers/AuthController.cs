using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using IqTestApi.Models;
using IqTestApi.Services;

namespace IqTestApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly AuthService _authService;
        private readonly ILogger<AuthController> _logger;

        public AuthController(AuthService authService, ILogger<AuthController> logger)
        {
            _authService = authService;
            _logger = logger;
        }

        [HttpPost("register")]
        public async Task<ActionResult<AuthResponse>> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var response = await _authService.RegisterAsync(request);
                return Ok(response);
            }
            catch (ArgumentException ex)
            {
                return BadRequest(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при регистрации");
                return StatusCode(500, new { error = "Внутренняя ошибка сервера" });
            }
        }

        [HttpPost("login")]
        public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
        {
            try
            {
                var response = await _authService.LoginAsync(request);
                return Ok(response);
            }
            catch (UnauthorizedAccessException ex)
            {
                return Unauthorized(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при входе");
                return StatusCode(500, new { error = "Внутренняя ошибка сервера" });
            }
        }

        [HttpGet("me")]
        [Authorize]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            try
            {
                var userId = _authService.GetUserIdFromToken(User);
                if (userId == null)
                {
                    return Unauthorized(new { error = "Недействительный токен" });
                }

                var user = await _authService.GetUserByIdAsync(userId.Value);
                if (user == null)
                {
                    return NotFound(new { error = "Пользователь не найден" });
                }

                return Ok(UserDto.FromEntity(user));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Ошибка при получении информации о пользователе");
                return StatusCode(500, new { error = "Внутренняя ошибка сервера" });
            }
        }

        [HttpPost("logout")]
        [Authorize]
        public IActionResult Logout()
        {
            // В случае JWT токенов, logout обычно обрабатывается на стороне клиента
            // путем удаления токена из localStorage/sessionStorage
            return Ok(new { message = "Выход выполнен успешно" });
        }

        [HttpGet("health")]
        public IActionResult Health()
        {
            return Ok(new { status = "OK", service = "Auth" });
        }
    }
}
