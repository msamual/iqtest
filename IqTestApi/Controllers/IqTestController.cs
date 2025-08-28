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
        public ActionResult<TestSession> StartTest()
        {
            try
            {
                var session = _iqTestService.CreateTestSession();
                return Ok(session);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("questions")]
        public ActionResult<List<IqQuestionForClient>> GetQuestions([FromQuery] int count = 20)
        {
            try
            {
                var questions = _iqTestService.GetQuestions(count);
                return Ok(questions);
            }
            catch (Exception ex)
            {
                return BadRequest(new { error = ex.Message });
            }
        }

        [HttpGet("questions/{id}")]
        public ActionResult<IqQuestion> GetQuestion(int id)
        {
            try
            {
                var question = _iqTestService.GetQuestionById(id);
                return Ok(question);
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

        [HttpPost("submit-answer")]
        public ActionResult<TestSession> SubmitAnswer([FromBody] SubmitAnswerRequest request)
        {
            try
            {
                var session = _iqTestService.SubmitAnswer(
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
        public ActionResult<TestSession> CompleteTest([FromBody] CompleteTestRequest request)
        {
            try
            {
                var session = _iqTestService.CompleteTest(request.SessionId);
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
        public ActionResult<TestSession> GetSession(Guid sessionId)
        {
            try
            {
                var session = _iqTestService.GetTestSession(sessionId);
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
