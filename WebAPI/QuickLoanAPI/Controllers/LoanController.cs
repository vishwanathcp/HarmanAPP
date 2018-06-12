﻿using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using QuickHomeLoanAPI.Manager;
using QuickHomeLoanAPI.Model;
using QuickLoanAPI.Data;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace QuickHomeLoanAPI.Controllers
{
    [Route("api/[controller]")]
    public class LoanController : Controller
	{
        private readonly QuickLoanDbContext _context = null;
        private readonly IConfiguration _configuration;

        public LoanController(QuickLoanDbContext context,  IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
        // GET api/loan/list/5
        [HttpGet("history/{userId}/{isRequest}")]
		public IActionResult GetLoanHistory(int userId, bool isRequest)
		{
            var loanMgr = new LoanManager(_context, _configuration);
            var loans = loanMgr.GetLoanHistory(userId, isRequest);
            return Ok(loans);
        }
        // GET api/loan/5
        [HttpGet("details/{loanId}/{isRequest}")]
        public IActionResult GetLoanDetails(string loanId, bool isRequest)
        {
            var loanMgr = new LoanManager(_context, _configuration);
            var loan = loanMgr.GetLoanDetails(loanId);
            if (isRequest == true)
            {
                loan.Documents = loanMgr.GetRequiredDocuments();
            }
            return Ok(loan);
        }
        // POST api/loan
        [HttpPost("update")]
        public IActionResult UpdateLoanRequest([FromBody]LoanApplication loanApplication)
        {
            var loanMgr = new LoanManager(_context, _configuration);
            return Ok(loanMgr.UpdateLoanRequest(loanApplication));
        }
        // POST api/loan
        [HttpPost("create")]
		public IActionResult CreateLoanRequest([FromBody]LoanRequest loanRequest)
        {
            var loanMgr = new LoanManager(_context, _configuration);
            return Ok(loanMgr.CreateLoanRequest(loanRequest));
        }
        [HttpPost]
        [Route("uploadfile")]
        public async Task<string> Upload(IFormFile file)
        {
            var loanMgr = new LoanManager(_context, _configuration);
            if (file == null) throw new Exception("File is null");
            if (file.Length == 0) throw new Exception("File is empty");
            string filePath = null;
            using (Stream stream = file.OpenReadStream())
            {
                using (var binaryReader = new BinaryReader(stream))
                {
                    var fileContent = binaryReader.ReadBytes((int)file.Length);
                    filePath = await loanMgr.UploadFile(fileContent, file.FileName, file.ContentType);
                }
            }
            return filePath;
        }
    }
}
