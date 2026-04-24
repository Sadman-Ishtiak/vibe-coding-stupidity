import Application from '../models/Application.js';
import Internship from '../models/Internship.js';
import { createNotification } from './notificationController.js';

export const applyToInternship = async (req, res) => {
  try {
    const { internshipId } = req.params;
    const { coverLetter, resumeUrl } = req.body;

    const internship = await Internship.findById(internshipId);
    if (!internship) return res.status(404).json({ error: 'Internship not found' });

    const existingApp = await Application.findOne({
      internship: internshipId,
      candidate: req.userId,
    });

    if (existingApp) {
      return res.status(400).json({ error: 'You have already applied to this internship' });
    }

    const application = new Application({
      internship: internshipId,
      candidate: req.userId,
      coverLetter,
      resumeUrl,
    });

    await application.save();

    await createNotification(
      internship.company,
      `New application for ${internship.title}`,
      'new_application',
      `/dashboard?internship=${internshipId}`
    );

    res.status(201).json({
      message: 'Applied successfully',
      application,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getApplicationsByCandidate = async (req, res) => {
  try {
    const applications = await Application.find({ candidate: req.userId })
      .populate('internship')
      .populate('candidate', 'firstName lastName email')
      .sort({ appliedAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getApplicationsByCompany = async (req, res) => {
  try {
    const applications = await Application.find()
      .populate({
        path: 'internship',
        match: { company: req.userId },
      })
      .populate('candidate', 'firstName lastName email phone skills')
      .sort({ appliedAt: -1 });

    const filtered = applications.filter((app) => app.internship);
    res.json(filtered);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getApplicationById = async (req, res) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('internship')
      .populate('candidate', 'firstName lastName email phone skills education');

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['Applied', 'Reviewed', 'Shortlisted', 'Rejected', 'Accepted'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const application = await Application.findById(req.params.id)
      .populate('internship')
      .populate('candidate');

    if (!application) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (application.internship.company.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized' });
    }

    application.status = status;
    await application.save();

    await createNotification(
      application.candidate._id,
      `Your application for ${application.internship.title} is now ${status}`,
      'status_update',
      '/dashboard'
    );

    res.json({
      message: 'Application status updated',
      application,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};