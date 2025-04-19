export default {
  async fetchActivities() {
    try {
      const res = await fetch('http://localhost:8000/api/v2/activities');
      return await res.json();
    } catch (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
  }
};
