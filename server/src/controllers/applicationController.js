const { v4: uuidv4 } = require('uuid');
const db = require('../models/database');

const VALID_STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected'];

// Format & validate interview dates array
function sanitizeInterviewDates(interviews) {
  if (!Array.isArray(interviews)) return [];
  return interviews.map((item, index) => {
    if (typeof item === 'string') {
      return {
        id: `int-${Date.now()}-${index}`,
        date: item,
        round: 'Interview Round',
        notes: '',
        completed: false
      };
    }
    return {
      id: item.id || `int-${Date.now()}-${index}`,
      date: item.date || new Date().toISOString(),
      round: item.round || 'Interview Round',
      notes: item.notes || '',
      completed: Boolean(item.completed)
    };
  });
}

// GET /api/applications - Get all applications for the current user
exports.getAllApplications = (req, res) => {
  try {
    const { status, search, sortBy, sortOrder } = req.query;
    const applications = db.findApplications(req.user.id, {
      status,
      search,
      sortBy,
      sortOrder
    });

    res.json({
      success: true,
      count: applications.length,
      data: applications
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve applications.' });
  }
};

// GET /api/applications/stats - Aggregate dashboard stats
exports.getStats = (req, res) => {
  try {
    const stats = db.getStats(req.user.id);
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error generating statistics:', error);
    res.status(500).json({ success: false, message: 'Failed to generate statistics.' });
  }
};

// GET /api/applications/:id - Get single application
exports.getApplicationById = (req, res) => {
  try {
    const app = db.findApplicationById(req.params.id, req.user.id);
    if (!app) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }
    res.json({
      success: true,
      data: app
    });
  } catch (error) {
    console.error('Error fetching application:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve application.' });
  }
};

// POST /api/applications - Create a new application
exports.createApplication = (req, res) => {
  try {
    const {
      company,
      role,
      jobLink,
      salaryExpectation,
      applicationDate,
      status = 'Applied',
      interviewDates = [],
      notes
    } = req.body;

    if (!company || !company.trim()) {
      return res.status(400).json({ success: false, message: 'Company name is required.' });
    }

    if (!role || !role.trim()) {
      return res.status(400).json({ success: false, message: 'Job role is required.' });
    }

    const sanitizedStatus = VALID_STATUSES.includes(status) ? status : 'Applied';

    const newApplication = {
      id: `app-${uuidv4()}`,
      userId: req.user.id,
      company: company.trim(),
      role: role.trim(),
      jobLink: jobLink ? jobLink.trim() : '',
      salaryExpectation: salaryExpectation ? Number(salaryExpectation) || salaryExpectation : null,
      applicationDate: applicationDate || new Date().toISOString().split('T')[0],
      status: sanitizedStatus,
      interviewDates: sanitizeInterviewDates(interviewDates),
      notes: notes ? notes.trim() : '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const saved = db.createApplication(newApplication);

    res.status(201).json({
      success: true,
      message: 'Job application created successfully!',
      data: saved
    });
  } catch (error) {
    console.error('Error creating application:', error);
    res.status(500).json({ success: false, message: 'Failed to create job application.' });
  }
};

// PATCH /api/applications/:id/status - Update stage/status of application
exports.updateStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${VALID_STATUSES.join(', ')}`
      });
    }

    const updated = db.updateStatus(id, req.user.id, status);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    res.json({
      success: true,
      message: `Status updated to '${status}' successfully.`,
      data: updated
    });
  } catch (error) {
    console.error('Error updating status:', error);
    res.status(500).json({ success: false, message: 'Failed to update application status.' });
  }
};

// PUT /api/applications/:id - Full update of an application
exports.updateApplication = (req, res) => {
  try {
    const { id } = req.params;
    const {
      company,
      role,
      jobLink,
      salaryExpectation,
      applicationDate,
      status,
      interviewDates,
      notes
    } = req.body;

    const existing = db.findApplicationById(id, req.user.id);
    if (!existing) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    const updates = {};
    if (company !== undefined) updates.company = company.trim();
    if (role !== undefined) updates.role = role.trim();
    if (jobLink !== undefined) updates.jobLink = jobLink.trim();
    if (salaryExpectation !== undefined) {
      updates.salaryExpectation = salaryExpectation ? Number(salaryExpectation) || salaryExpectation : null;
    }
    if (applicationDate !== undefined) updates.applicationDate = applicationDate;
    if (status !== undefined) {
      if (VALID_STATUSES.includes(status)) {
        updates.status = status;
      }
    }
    if (interviewDates !== undefined) {
      updates.interviewDates = sanitizeInterviewDates(interviewDates);
    }
    if (notes !== undefined) updates.notes = notes.trim();

    const updated = db.updateApplication(id, req.user.id, updates);

    res.json({
      success: true,
      message: 'Application updated successfully!',
      data: updated
    });
  } catch (error) {
    console.error('Error updating application:', error);
    res.status(500).json({ success: false, message: 'Failed to update application.' });
  }
};

// DELETE /api/applications/:id - Delete application
exports.deleteApplication = (req, res) => {
  try {
    const { id } = req.params;
    const success = db.deleteApplication(id, req.user.id);

    if (!success) {
      return res.status(404).json({ success: false, message: 'Application not found.' });
    }

    res.json({
      success: true,
      message: 'Job application deleted successfully.'
    });
  } catch (error) {
    console.error('Error deleting application:', error);
    res.status(500).json({ success: false, message: 'Failed to delete application.' });
  }
};
