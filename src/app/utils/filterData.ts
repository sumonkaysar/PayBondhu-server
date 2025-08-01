import { Model } from "mongoose";

const FilterData = async <T>(
  DocumentModel: Model<T>,
  query: Record<string, string | object>,
  searchableFields?: string[]
) => {
  const {
    searchTerm = "",
    sort = "-createdAt",
    fields = "",
    page = "1",
    limit = "10",
    ...filter
  } = query;

  let searchQuery = {};

  if (searchTerm && searchableFields?.length) {
    searchQuery = {
      $or: searchableFields.map((field) => ({
        [field]: { $regex: searchTerm, $options: "i" },
      })),
    };
  }
  const finalQuery = { ...searchQuery, ...filter };

  const filtered = DocumentModel.find(finalQuery)
    .sort(sort as string)
    .select((fields as string).split(",").join(" "))
    .limit(Number(limit))
    .skip((Number(page) - 1) * Number(limit));

  const total = await DocumentModel.countDocuments(finalQuery);

  return {
    data: filtered,
    meta: {
      page: Number(page),
      limit: Number(limit),
      total,
      totalPage: Math.ceil(total / Number(limit)),
    },
  };
};

export default FilterData;
