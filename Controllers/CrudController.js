import mongoose from "mongoose";
import { Actor, Producer, Movie} from "../Models/Schema.js";
import jwt from "jsonwebtoken";

// 🔹 Get all movies
export const getAllMovies = async (req, res) => {
  try {
    const { actorName, producerName } = req.query;

    let movies = await Movie.find()
      .populate("producer", "name")
      .populate("actors", "name");

    // Filter by actor name (if provided)
    if (actorName) {
      const nameLower = actorName.toLowerCase();
      movies = movies.filter(movie =>
        movie.actors.some(actor => actor.name.toLowerCase().includes(nameLower))
      );
    }

    // Filter by producer name (if provided)
    if (producerName) {
      const nameLower = producerName.toLowerCase();
      movies = movies.filter(movie =>
        movie.producer?.name?.toLowerCase().includes(nameLower)
      );
    }

    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 Add a new movie (auto-fetch actor & producer IDs by name)
export const addMovie = async (req, res) => {
    try {
      const { name, plot, poster,trailerUrl, releaseDate, genre, producerName, actorNames,coActor,about, rating } = req.body;
  
      // ✅ Get producer by name
      let producer = await Producer.findOne({ name: producerName });
      if (!producer) {
        producer = new Producer({ name: producerName });
        await producer.save();
      }
  
      // ✅ Get actors by name
      let actors = await Actor.find({ name: { $in: actorNames } });
  
      // If actors are not found, create new actors
      const missingActorNames = actorNames.filter(name => !actors.some(actor => actor.name === name));
      const newActors = await Promise.all(
        missingActorNames.map(name => new Actor({ name }).save())
      );
      
      // Add newly created actors to the actors array
      actors = [...actors, ...newActors];
  
      // Create the movie
      const movie = new Movie({
        name,
        plot,
        poster,
        trailerUrl,
        releaseDate,
        genre,
        producer: producer._id,
        actors: actors.map(actor => actor._id),
        coActor, 
        about, 
        rating,
      });
  
      await movie.save();
      res.status(201).json(movie);
  
    } catch (error) {
      console.error(error);  // Add a log for better debugging
      res.status(500).json({ message: error.message });
    }
  };
  export const getMovieById = async (req, res) => {
    const { id } = req.params;
  
    // ✅ Validate ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid movie ID" });
    }
  
    try {
      const movie = await Movie.findById(id)
        .populate("producer", "name")
        .populate("actors", "name");
  
      if (!movie) {
        return res.status(404).json({ message: "Movie not found" });
      }
  
      res.json(movie);
    } catch (err) {
      console.error("Error fetching movie:", err);
      res.status(500).json({ message: "Server error" });
    }
  };
  
// 🔹 Update movie by ID
export const updateMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, plot, poster, releaseDate, genre, producerName, actorNames, rating } = req.body;

    const producer = await Producer.findOne({ name: producerName });
    const actors = await Actor.find({ name: { $in: actorNames } });

    const updatedMovie = await Movie.findByIdAndUpdate(
      id,
      {
        name,
        plot,
        poster,
        releaseDate,
        genre,
        producer: producer?._id,
        actors: actors.map(actor => actor._id),
        rating,
      },
      { new: true }
    ).populate("producer").populate("actors");

    if (!updatedMovie) return res.status(404).json({ message: "Movie not found" });

    res.status(200).json(updatedMovie);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Delete movie
export const deleteMovie = async (req, res) => {
  try {
    const { id } = req.params;
    const movie = await Movie.findByIdAndDelete(id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });

    res.status(200).json({ message: "Movie deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });

    // Create new user
    user = new User({ username, email, password });
    await user.save();

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });

    res.status(201).json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email }).select('+password');
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Check password
    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE
    });

    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }

}
export const getUser = async (req, res) => {
  try {
    // Get token from header
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token, authorization denied' });

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select('-password');

    res.json(user);
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}