import { Storage } from "aws-amplify";

export const uploadImage = async (file: File) => {
  const filename = `${Date.now()}-${file.name}`;

  const stored = await Storage.put(filename, file, {
    contentType: file.type,
  });

  return { key: stored.key};
}
