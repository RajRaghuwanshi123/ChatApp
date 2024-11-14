import User from "../models/userModel.js";

export const searchContact = async (request, response, next) => {
  try {
    const { searchTerm } = request.body;

    if (searchTerm === undefined || searchTerm === null)
    {
        return response.status(400).send("search term is required")
    }

    const sanitizedSearchTerm = searchTerm.replace(
        /[.*+?${}()|[\]\\]/g,
        "\\$&"
    );

    const regex = new RegExp(sanitizedSearchTerm , "i");
    const contacts = await User.find({
        $and: [{_id: {$ne : request.userId}},
            {
                $or: [{firstName: regex} , {lastName:regex} , {email:regex}],
            },
        ],
    })

      return response.status(200).json({contacts});
  } catch (error) {
    return response.status(500).send({ message: "Internal server problem" });
  }
};
