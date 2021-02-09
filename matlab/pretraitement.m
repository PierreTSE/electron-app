%%
% le slash final est important
directory_name = 'D:\_Telecom Saint-Etienne\_Projets\FISE3 - Projet Vision OCR\sample\';
output_directory = 'processed/';
%% process
mkdir(output_directory)
files = dir(strcat(directory_name, '*.bmp'));
for i = 1:numel(files)
    filename = files(i).name;
    disp(filename);
    I = imread(strcat(directory_name, filename));
    
    % filtrage initial
    N=15;
    filter = zeros(N,N)-1;
    filter(fix(size(filter,1)/2)+1, fix(size(filter,2)/2)+1) = N*N-1;
    I = imfilter(I, filter);
    % cropping sur la bande intéressante
    % I = I(515:615,:); % pas généralisable
    % seuillage
    I(I<200) = 0;
    % fermeture pour combler les espaces
    I = imclose(I, strel('disk',3));
    % inversion pour que le texte soit noir sur blanc
    I = 255-I;
    
    imwrite(I, strcat(output_directory, filename));
end