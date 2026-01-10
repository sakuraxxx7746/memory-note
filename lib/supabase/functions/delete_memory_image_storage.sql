-- memory_imagesレコード削除時に、ストレージのファイルも自動削除するトリガー

-- トリガー関数の作成
CREATE OR REPLACE FUNCTION delete_memory_image_storage()
RETURNS TRIGGER AS $$
DECLARE
  storage_path TEXT;
BEGIN
  -- image_urlからストレージパスを抽出
  -- 例: https://xxx.supabase.co/storage/v1/object/public/memory-images/memories/user_id/memory_id/file.jpg
  -- → memories/user_id/memory_id/file.jpg
  storage_path := regexp_replace(
    OLD.image_url,
    '^.*/storage/v1/object/public/memory-images/',
    ''
  );

  -- storage.objectsテーブルから削除
  DELETE FROM storage.objects
  WHERE bucket_id = 'memory-images'
    AND name = storage_path;

  RETURN OLD;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- トリガーの作成
DROP TRIGGER IF EXISTS on_memory_image_delete ON memory_images;

CREATE TRIGGER on_memory_image_delete
  BEFORE DELETE ON memory_images
  FOR EACH ROW
  EXECUTE FUNCTION delete_memory_image_storage();

-- 使用例:
-- DELETE FROM memory_images WHERE id = 'xxx';
-- → memory_imagesレコードとストレージファイルの両方が削除される
