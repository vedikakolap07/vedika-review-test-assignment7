import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
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
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(SignupSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      setLoading(true);
      setError(null);

      await signUp({
        role: 'patient',
        name: data.name,
        age: data.age,
        email: data.email,
        phone: data.phone,
        surgeryHistory: data.surgeryHistory || '',
        illnessHistory: data.illnessHistory || '',
        password: data.password,
      });

      navigate("/patient/dashboard");
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const illnessRaw = watch("illnessHistory") || "";
  const illnessItems = illnessRaw
    .split(",")
    .map((i: string) => i.trim())
    .filter(Boolean);

  return (
    <div className="auth-page">
      <div className="auth-panel">
        <div className="auth-panel-content">
          <div className="auth-panel-icon">🧑‍🦽</div>
          <h2>Join as Patient</h2>
          <p>Create your account to consult with doctors and receive prescriptions online.</p>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-box">
          <h2>Patient Sign Up</h2>
          <p className="auth-subtitle">Create your patient account</p>
          {error && <div className="form-error-box">⚠️ {error}</div>}

          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" placeholder="Full Name" {...register("name")} />
              {errors.name && <span className="field-error">{String(errors.name.message)}</span>}
            </div>

            <div className="form-group">
              <label>Age</label>
              <input type="number" placeholder="Age" {...register("age")} />
              {errors.age && <span className="field-error">{String(errors.age.message)}</span>}
            </div>

            <div className="form-group">
              <label>Email</label>
              <input type="email" placeholder="Email" {...register("email")} />
              {errors.email && <span className="field-error">{String(errors.email.message)}</span>}
            </div>

            <div className="form-group">
              <label>Phone</label>
              <input type="tel" placeholder="Phone Number" {...register("phone")} />
              {errors.phone && <span className="field-error">{String(errors.phone.message)}</span>}
            </div>

            <div className="form-group">
              <label>History of Surgery (optional)</label>
              <textarea placeholder="History of Surgery (optional)" {...register("surgeryHistory")} rows={2} />
              {errors.surgeryHistory && <span className="field-error">{String(errors.surgeryHistory.message)}</span>}
            </div>

            <div className="form-group">
              <label>History of Illness (optional)</label>
              <textarea placeholder="History of Illness (optional)" {...register("illnessHistory")} rows={2} />
              {errors.illnessHistory && <span className="field-error">{String(errors.illnessHistory.message)}</span>}
              {illnessItems.length > 0 && (
                <div className="tags-panel" style={{ marginTop: '0.5rem' }}>
                  {illnessItems.map((item: string) => (
                    <span className="tag" key={item}>{item}</span>
                  ))}
                </div>
              )}
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

            <button className="btn btn-accent btn-lg" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Sign Up"}
            </button>
          </form>

          <div className="auth-link">
            Already have an account? <Link to="/patient/signin">Sign in</Link>
          </div>
        </div>
      </div>
    </div>
  );
};