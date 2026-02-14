import axios from "axios";

const API = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchMyJobs = async () => {
  const token = localStorage.getItem("token");

  const res = await axios.get(`${API}/tech-jobs/my`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data ?? null;
};
