import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
// import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const SignupSchema = z
  .object({
    name: z.string().min(2, "Name is required"),
    age: z.string().min(1, "Age is required"),
    email: z.string().email("Invalid email address"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    surgeryHistory: z.string().optional(),
    illnessHistory: z.string().optional(),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const PatientSignup = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth(); // make sure this exists
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);

      await signUp({
        name: data.name,
        age: data.age,
        email: data.email,
        phone: data.phone,
        surgeryHistory: data.surgeryHistory,
        illnessHistory: data.illnessHistory,  
        password: data.password,
      });

      // toast.success("Account created successfully!");
      navigate("/dashboard");
    } catch (err) {
      // toast.error("Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <h2>Patient Sign Up</h2>

      <form onSubmit={handleSubmit(onSubmit)}>

        {/* Name */}
        <div>
          <input
            type="text"
            placeholder="Full Name"
            {...register("name")}
          />
          {errors.name && <p>{errors.name.message}</p>}
        </div>

        {/* Email */}
        <div>
          <input
            type="email"
            placeholder="Email"
            {...register("email")}
          />
          {errors.email && <p>{errors.email.message}</p>}
        </div>

        {/* Password */}
        <div>
          <input
            type="password"
            placeholder="Password"
            {...register("password")}
          />
          {errors.password && <p>{errors.password.message}</p>}
        </div>

        {/* Confirm Password */}
        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            {...register("confirmPassword")}
          />
          {errors.confirmPassword && (
            <p>{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Button */}
        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign Up"}
        </button>
      </form>

      <p>
        Already have an account? <Link to="/signin">Sign in</Link>
      </p>
    </div>
  );
};
