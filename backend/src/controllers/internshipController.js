import Internship from '../models/Internship.js';

export const getAllInternships = async (req, res) => {
  try {
    console.log('GET /internships query:', req.query);
    const { category, location, search } = req.query;
    const filter = { isActive: true };

    if (category) filter.category = category;
    if (location) filter.location = { $regex: location, $options: 'i' };
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const internships = await Internship.find(filter)
      .populate('company', 'firstName lastName companyName email')
      .sort({ createdAt: -1 });

    res.json(internships);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getInternshipById = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id).populate(
      'company',
      'firstName lastName companyName companyWebsite companyLocation email'
    );

    if (!internship) {
      return res.status(404).json({ error: 'Internship not found' });
    }

    res.json(internship);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getMyInternships = async (req, res) => {
  try {
    const internships = await Internship.find({ company: req.userId })
      .sort({ createdAt: -1 });
    res.json(internships);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createInternship = async (req, res) => {
  try {
    const {
      title,
      description,
      location,
      category,
      startDate,
      endDate,
      stipend,
      stipendType,
      duration,
      requirements,
      perks,
    } = req.body;

    if (!title || !description || !location || !category) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    const internship = new Internship({
      title,
      description,
      company: req.userId,
      location,
      category,
      startDate,
      endDate,
      stipend,
      stipendType,
      duration,
      requirements: requirements || [],
      perks: perks || [],
    });

    await internship.save();
    res.status(201).json({
      message: 'Internship created successfully',
      internship,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({ error: 'Internship not found' });
    }

    if (internship.company.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to update this internship' });
    }

    const updated = await Internship.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: 'Internship updated successfully',
      internship: updated,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteInternship = async (req, res) => {
  try {
    const internship = await Internship.findById(req.params.id);

    if (!internship) {
      return res.status(404).json({ error: 'Internship not found' });
    }

    if (internship.company.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this internship' });
    }

    await Internship.findByIdAndDelete(req.params.id);
    res.json({ message: 'Internship deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
