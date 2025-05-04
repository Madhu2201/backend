import mongoose ,{model} from 'mongoose';
const actorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    gender: String,
    dob: Date,
    bio: String,
  });
  
  const Actor = mongoose.model('Actor', actorSchema);

  const producerSchema = new mongoose.Schema({
    name: { type: String, required: true },
    gender: String,
    dob: Date,
    bio: String,
  });
  
  const Producer = mongoose.model('Producer', producerSchema);

const movieSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    plot: String,
    poster: String, // URL or image path
    trailerUrl: String,
    releaseDate: { type: Date, required: true },
    genre: [String], // e.g., ["Action", "Drama"]
    producer: { type: mongoose.Schema.Types.ObjectId, ref: "Producer", required: true },
    actors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Actor" }],
    about : String,
    coActor: [String] ,
    rating: { type: Number, min: 0, max: 10 },
});



const Movie = mongoose.model('Movie', movieSchema);
export  {Actor,Producer,Movie};