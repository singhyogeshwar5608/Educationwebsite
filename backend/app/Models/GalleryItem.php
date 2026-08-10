<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class GalleryItem extends Model
{
    protected $fillable = ['file_url', 'file_type', 'title', 'album_id'];

    public function album(): BelongsTo { return $this->belongsTo(GalleryAlbum::class, 'album_id'); }
}
