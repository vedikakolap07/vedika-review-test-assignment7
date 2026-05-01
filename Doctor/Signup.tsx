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
    specialty: z.string().min(2, "Specialty is required"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    email: z.string().email("Invalid email address"),
    experience: z.string().min(1, "Experience is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    avatarUrl: z.string().url("Invalid URL").optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const DoctorSignup = () => {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      setError(null);

      await signUp({
        role: 'doctor',
        name: data.name,
        email: data.email,
        password: data.password,
        specialty: data.specialty,
        phone: data.phone,
        experience: data.experience,
        avatarUrl: data.avatarUrl,
      });

      navigate("/doctor/profile");
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="auth-page">
    <div className="auth-panel">
      <div className="auth-panel-content">
        <div className="auth-panel-icon">🧑‍⚕️</div>
        <h2>Join as Doctor</h2>
        <p>Create your profile and start consulting patients online.</p>
      </div>
    </div>

    <div className="auth-form-side">
      <div className="auth-box">
        <h2>Doctor Sign Up</h2>
        <p className="auth-subtitle">Create your doctor account</p>
        {error && <div className="form-error-box">⚠️ {error}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label>Full Name</label>
            <input type="text" placeholder="Full Name" {...register("name")} />
            {errors.name && <span className="field-error">{String(errors.name.message)}</span>}
          </div>

          <div className="form-group">
            <label>Specialty</label>
            <input type="text" placeholder="Specialty (e.g. Cardiologist)" {...register("specialty")} />
            {errors.specialty && <span className="field-error">{String(errors.specialty.message)}</span>}
          </div>

          <div className="form-group">
            <label>Phone</label>
            <input type="tel" placeholder="Phone Number" {...register("phone")} />
            {errors.phone && <span className="field-error">{String(errors.phone.message)}</span>}
          </div>

          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="Email" {...register("email")} />
            {errors.email && <span className="field-error">{String(errors.email.message)}</span>}
          </div>

          <div className="form-group">
            <label>Experience (years)</label>
            <input type="number" step="0.5" placeholder="Years of Experience (e.g. 1.5)" {...register("experience")} />
            {errors.experience && <span className="field-error">{String(errors.experience.message)}</span>}
          </div>

          <div className="form-group">
            <label>Avatar URL (optional)</label>
            <input type="url" placeholder="Profile Picture URL (optional)" {...register("avatarUrl")} />
            {errors.avatarUrl && <span className="field-error">{String(errors.avatarUrl.message)}</span>}
          </div>

          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="Password" {...register("password")} />
            {errors.password && <span className="field-error">{String(errors.password.message)}</span>}
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <input type="password" placeholder="Confirm Password" {...register("confirmPassword")} />
            {errors.confirmPassword && <span className="field-error">{String(errors.confirmPassword.message)}</span>}
          </div>

          <button className="btn btn-primary btn-lg" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>

        <div className="auth-link">
          Already have an account? <Link to="/doctor/signin">Sign in</Link>
        </div>
      </div>
    </div>
  </div>
);
};
