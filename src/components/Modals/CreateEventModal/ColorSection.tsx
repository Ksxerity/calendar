import React, { JSX } from 'react';

type ColorSectionProps = {
  selected: string,
  setValue: ((value: string) => void),
};

const ColorSection = (props: ColorSectionProps): JSX.Element => {
  const { selected, setValue } = props;

  return (
    <div className='flex flex-row'>
      <button
        type="button"
        aria-label="Color Green"
        className={`bg-custom-green mr-1 h-[30px] w-[30px] border-4 rounded-[50%] border-transparent ${selected === 'green' ? '!border-[#1e293b]' : null}`}
        onClick={() => setValue('green')}
      />
      <button
        type="button"
        aria-label="Color Lightgreen"
        className={`bg-custom-lightgreen mr-1 h-[30px] w-[30px] border-4 rounded-[50%] border-transparent ${selected === 'lightgreen' ? '!border-[#1e293b]' : null}`}
        onClick={() => setValue('lightgreen')}
      />
      <button
        type="button"
        id="blue"
        aria-label="Color Blue"
        className={`bg-custom-blue mr-1 h-[30px] w-[30px] border-4 rounded-[50%] border-transparent ${selected === 'blue' ? '!border-[#1e293b]' : null}`}
        onClick={() => setValue('blue')}
      />
      <button
        type="button"
        id="purple"
        aria-label="Color Purple"
        className={`bg-custom-purple mr-1 h-[30px] w-[30px] border-4 rounded-[50%] border-transparent ${selected === 'purple' ? '!border-[#1e293b]' : null}`}
        onClick={() => setValue('purple')}
      />
      <button
        type="button"
        id="yellow"
        aria-label="Color Yellow"
        className={`bg-custom-yellow mr-1 h-[30px] w-[30px] border-4 rounded-[50%] border-transparent ${selected === 'yellow' ? '!border-[#1e293b]' : null}`}
        onClick={() => setValue('yellow')}
      />
      <button
        type="button"
        id="orange"
        aria-label="Color Orange"
        className={`bg-custom-orange mr-1 h-[30px] w-[30px] border-4 rounded-[50%] border-transparent ${selected === 'orange' ? '!border-[#1e293b]' : null}`}
        onClick={() => setValue('orange')}
      />
      <button
        type="button"
        id="red"
        aria-label="Color Red"
        className={`bg-custom-red mr-1 h-[30px] w-[30px] border-4 rounded-[50%] border-transparent ${selected === 'red' ? '!border-[#1e293b]' : null}`}
        onClick={() => setValue('red')}
      />
    </div>
  );
};

export default ColorSection;
