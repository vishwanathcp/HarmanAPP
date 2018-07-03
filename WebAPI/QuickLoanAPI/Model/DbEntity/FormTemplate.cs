﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace QuickLoanAPI.Model.DbEntity
{
    public class FormTemplate
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public User CreatedBy { get; set; }
        public int CreatedById { get; set; }
        public string Version { get; set; }
        public DateTime CreatedDate { get; set; }
        public bool IsActive { get; set; }
        public List<FormSection> Sections { get; set; }
    }
}