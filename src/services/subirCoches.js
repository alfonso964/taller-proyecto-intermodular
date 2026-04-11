import { supabase } from '../supabaseClient';

export const uploadCocheImages = async (files) => {

  const uploadPromises = Array.from(files).map(async (file) => {

    const fileExt = file.name.split('.').pop();

    const fileName = `${Math.random()}-${Date.now()}.${fileExt}`;

    const filePath = `${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('coches')
      .upload(filePath, file);
    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('coches')
      .getPublicUrl(filePath);
    return data.publicUrl;

  });
  return Promise.all(uploadPromises);

};