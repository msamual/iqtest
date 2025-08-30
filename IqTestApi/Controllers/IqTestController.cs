using Microsoft.AspNetCore.Mvc;
using IqTestApi.Services;
using IqTestApi.Models;

namespace IqTestApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class IqTestController : ControllerBase
    {
        [HttpGet("health")]
        public IActionResult Health()
        {
            return Ok(new { status = "healthy", timestamp = DateTime.UtcNow });
        }
        private readonly IIqTestService _iqTestService;

        public IqTestController(IIqTestService iqTestService)
        {
            _iqTestService = iqTestService;
        }

        [HttpPost("start")]
        public async Task<ActionResult<TestSession>> StartTest()
        {
            try
            {
                var session = await _iqTestService.CreateTestSessionAsync();
                return Ok(session);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("questions")]
        public async Task<ActionResult<List<IqQuestionForClient>>> GetQuestions([FromQuery] int count = 20)
        {
            try
            {
                var questions = await _iqTestService.GetQuestionsAsync(count);
                return Ok(questions);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("questions/{id}")]
        public async Task<ActionResult<IqQuestion>> GetQuestion(int id)
        {
            try
            {
                var question = await _iqTestService.GetQuestionByIdAsync(id);
                if (question == null)
                {
                    return NotFound(new { error = "Question not found" });
                }
                return Ok(question);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("submit-answer")]
        public async Task<ActionResult<TestSession>> SubmitAnswer([FromBody] SubmitAnswerRequest request)
        {
            try
            {
                var session = await _iqTestService.SubmitAnswerAsync(
                    request.SessionId, 
                    request.QuestionId, 
                    request.AnswerIndex, 
                    request.TimeSpent
                );
                return Ok(session);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpPost("complete")]
        public async Task<ActionResult<TestSession>> CompleteTest([FromBody] CompleteTestRequest request)
        {
            try
            {
                var session = await _iqTestService.CompleteTestAsync(request.SessionId);
                return Ok(session);
            }
            catch (ArgumentException ex)
            {
                return NotFound(new { error = ex.Message });
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("session/{sessionId}")]
        public async Task<ActionResult<TestSession>> GetSession(Guid sessionId)
        {
            try
            {
                var session = await _iqTestService.GetTestSessionAsync(sessionId);
                if (session == null)
                {
                    return NotFound(new { error = "Session not found" });
                }
                return Ok(session);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }
    }

    public class SubmitAnswerRequest
    {
        public Guid SessionId { get; set; }
        public int QuestionId { get; set; }
        public int AnswerIndex { get; set; }
        public int TimeSpent { get; set; }
    }

    public class CompleteTestRequest
    {
        public Guid SessionId { get; set; }
    }
}
