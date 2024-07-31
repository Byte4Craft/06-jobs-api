const Job = require("../models/Job");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const createJob = async (req, res) => {
  const { company, position, status } = req.body;
  const {
    user: { userId },
  } = req;
  const jobData = {
    company,
    position,
    status: status,
    createdBy: userId,
  };
  const job = await Job.create(jobData);

  res.json({ job });
};

const getAllJobs = async (req, res) => {
    const {user: {userId}} = req;
    const jobs = await Job.find({createdBy: userId}).sort("createdAt");

  res.send({ count: jobs.length, jobs });
};

const getJob = async (req, res) => {
    const {
        params: {id}
    } = req;

    const job = await Job.findOne({ _id: id });
    
    if (!job) {
        throw new NotFoundError(`No job with id: ${id}`);
    }

  res.status(StatusCodes.OK).json({ job });
};

const updateJob = async (req, res) => {
  const {
    body: { company, position, status },
    params: { id },
    user: { userId },
  } = req;
    
    const job = await Job.findOne({ _id: id, createdBy: userId });

    if (!job) {
        throw new NotFoundError(`No job with id: ${id}`);
    }

    if (company) {
        job.company = company;
    }

    if (position) {
        job.position = position;
    }

    if (status) {
        job.status = status;
    }

    const updatedJob = await job.save();

    return res.status(StatusCodes.OK).json({ job: updatedJob });
};

const deleteJob = async (req, res) => {
  const {
    params: { id },
    user: { userId },
  } = req;
    
    const job = await Job.findOne({ _id: id, createdBy: userId });

    if (!job) {
        throw new NotFoundError(`No job with id: ${id} or you don't have permission to remove it`);
    }

    await job.remove();

    return res.status(StatusCodes.OK).send();
};

module.exports = {
  createJob,
  getAllJobs,
  getJob,
  updateJob,
  deleteJob,
};
