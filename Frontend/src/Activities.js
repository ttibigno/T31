export default {
  async fetchActivities() {
    try {
      const res = await fetch('https://backend-aroundyou.onrender.com/api/v2/activities');
      return await res.json();
    } catch (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
  }
};
