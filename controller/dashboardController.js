class dashboardController {
  dashboardPage = async (req, res) => {
    const { userInfo } = req;
    return res.render("dashboard/index", { userInfo });
  };
}
module.exports = new dashboardController();
