const { Reaction, Thought, User } = require('../models');

module.exports = {

async getAllThoughts(req, res) {
  try {
    const thoughts = await Thought.find();
    res.json(thoughts);
  } catch (err) {
    res.status(500).json(err);
  }
},
async getSingleThought(req, res) {
  try {
    const thought = await Thought.findOne({ _id: req.params.thoughtId })
      .select('-__v');

    if (!thought) {
      return res.status(404).json({ message: 'No thought with that ID' });
    }

    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
},
async createThought (req, res) {
  console.log('You are adding a thought');
  console.log(req.body);

  try {
    const thought = await Thought.create(req.body);
    const user = await User.updateOne(
      { _id: req.params.userId },
      { $addToSet: { thoughts: thought._id } },
      { runValidators: true, new: true }
    );

    if (!user) {
      return res
        .status(404)
        .json({ message: 'No user user with that ID :(' });
    }

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
},
// async createThought(req, res) {
//   try {
//     const thought = await Thought.create(req.body);
//     res.json(thought);
//   } catch (err) {
//     console.log(err);
//     return res.status(500).json(err);
//   }
// },
async deleteThought(req, res) {
  try {
    const thought = await Thought.findOneAndDelete({ _id: req.params.thoughtId });

    if (!thought) {
      res.status(404).json({ message: 'No thought with that ID' });
    }

    await Reaction.deleteMany({ _id: { $in: thought.reactions } });
    res.json({ message: 'Thought and reactions deleted!' });
  } catch (err) {
    res.status(500).json(err);
  }
},
async updateThought(req, res) {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $set: req.body },
      { runValidators: true, new: true }
    );

    if (!thought) {
      res.status(404).json({ message: 'No thought with this id!' });
    }

    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
},

async addReaction(req, res) {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $push: { reactions: req.body } },
      { runValidators: true, new: true }
    );

    if (!thought) {
      return res.status(404).json({ message: 'No thought found with this id!' });
    }

    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
},

async removeReaction(req, res) {
  try {
    const thought = await Thought.findOneAndUpdate(
      { _id: req.params.thoughtId },
      { $pull: { reactions: { reactionId: req.params.reactionId } } },
      { runValidators: true, new: true }
    );

    if (!thought) {
      return res.status(404).json({ message: 'No thought found with this id!' });
    }

    res.json(thought);
  } catch (err) {
    res.status(500).json(err);
  }
},
};