export const PRODUCT_IMAGE_MAP: Record<string, string[]> = {
    "Raspberry Pi 5 (8GB)": [
        "https://images.unsplash.com/photo-1610812387871-806d3db9f5aa?q=95&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1586920740199-47ce35183cfd?q=95&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1611532736597-de2d4265fba3?q=95&w=1200&auto=format&fit=crop"
    ],
    "WiFi Pineapple Mark VII": [
        "https://shop.hak5.org/cdn/shop/products/wp-mk7_81d03a53-bf1a-426f-9425-a34c8b3d9c85.jpg?v=1599680489&width=1200",
        "https://shop.hak5.org/cdn/shop/files/mk7-standard-and-pro_2000x.jpg?v=1614343331",
        "https://shop.hak5.org/cdn/shop/files/mk7-banner1_2000x.jpg?v=1614343192"
    ], 
    "Flipper Zero": [
        "https://cdn.flipper.net/zero_landing_what-is_flipper.gif",
        "https://cdn.flipper.net/zero_landing_what-is_inhand.png",
        "https://cdn.flipper.net/zero-landing-features_1.png"
    ],
    "USB Rubber Ducky": [
        "https://shop.hak5.org/cdn/shop/products/usb-rubber-ducky_mk2.jpg?v=1659974440&width=1200",
        "https://images.unsplash.com/photo-1597852074816-d933c7d2b988?q=95&w=1200&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1563206767-5b18f218e8de?q=95&w=1200&auto=format&fit=crop"
    ]
};

export function getProductImages(productName: string, dbImage?: string, dbImages?: string[]): string[] {
    const mappedImages = PRODUCT_IMAGE_MAP[productName];
    
    if (mappedImages && mappedImages.length > 0) {
        return mappedImages;
    }
    
    if (dbImages && dbImages.length > 0) {
        return dbImages;
    }
    
    const fallbackImage = dbImage?.includes('via.placeholder') 
        ? 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=95&w=1200&auto=format,compress&fit=crop&dpr=2' 
        : dbImage || 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=95&w=1200&auto=format,compress&fit=crop&dpr=2';
    
    return [fallbackImage];
}
